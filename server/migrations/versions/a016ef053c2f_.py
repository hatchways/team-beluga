"""empty message

Revision ID: a016ef053c2f
Revises: 5ac3ac59da92
Create Date: 2021-03-16 23:53:57.283846

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a016ef053c2f'
down_revision = '5ac3ac59da92'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('url', sa.String(length=64), nullable=True))
    op.create_unique_constraint(None, 'users', ['url'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_column('users', 'url')
    # ### end Alembic commands ###